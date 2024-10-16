"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = require("~/trpc/react");
const table_1 = require("~/components/ui/table");
const BarLoader_1 = __importDefault(require("react-spinners/BarLoader"));
const MatchList = () => {
    const query = react_2.api.match.runMatch.useQuery();
    const matches = query.data;
    const [isComplete, setIsComplete] = (0, react_1.useState)(false); // State to track if counting should stop
    // Reset count up completion state on new loading
    (0, react_1.useEffect)(() => {
        if (query.isLoading) {
            setIsComplete(false);
        }
    }, [query.isLoading]);
    if (query.isLoading && !isComplete) {
        return (<div className="flex min-h-screen items-center justify-center">
        {/* <CountUp
              start={0}
              end={100}
              duration={4.5}
              onEnd={() => {
                setIsComplete(true); // Set completion when count up finishes
              }}
            >
              {({ countUpRef }) => (
                <div>
                  <span
                    className="text-3xl font-semibold text-primary-purple-900"
                    ref={countUpRef}
                  />
                </div>
              )}
            </CountUp> */}
        <BarLoader_1.default color="#8d33ff" width={250}/>
      </div>);
    }
    if (query.error) {
        return (<div className="flex min-h-screen items-center justify-center">
        {query.error.message}
      </div>);
    }
    return (<div className="p-10">
      <table_1.Table>
        <table_1.TableCaption>
          A list of matched ECMO machines to patients.
        </table_1.TableCaption>
        <table_1.TableHeader>
          <table_1.TableRow>
            <table_1.TableHead className="w-1/3">Patient Name</table_1.TableHead>
            <table_1.TableHead className="w-1/3">ECMO Type</table_1.TableHead>
            <table_1.TableHead className="w-1/3 text-right">Machine Info</table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {matches?.map((match) => (<table_1.TableRow key={match.id}>
              <table_1.TableCell>{match.patientName}</table_1.TableCell>
              <table_1.TableCell>
                {match.ecmoId === null
                ? "No ECMO found for this patient"
                : match.ecmoType}
              </table_1.TableCell>
              <table_1.TableCell className="text-right">
                {match.location === null &&
                match.distance === null &&
                match.duration === null ? ("Match not found") : (<>
                    {match.location}
                    <br />
                    Distance:{" "}
                    {match.distance ? `${match.distance} miles` : "N/A"}
                    <br />
                    Duration:{" "}
                    {match.duration ? `${match.duration} minutes` : "N/A"}
                  </>)}
              </table_1.TableCell>
            </table_1.TableRow>))}
        </table_1.TableBody>
      </table_1.Table>
    </div>);
};
exports.default = MatchList;
